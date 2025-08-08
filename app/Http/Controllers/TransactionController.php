<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions.
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'company', 'items.product'])
            ->latest();

        if ($request->has('company_id') && $request->company_id) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $transactions = $query->paginate(10);

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'filters' => $request->only(['company_id', 'search']),
        ]);
    }

    /**
     * Store a newly created transaction.
     */
    public function store(StoreTransactionRequest $request)
    {
        try {
            DB::beginTransaction();

            $validatedData = $request->validated();

            // Generate transaction number
            $transactionNumber = 'TRX-' . date('Ymd') . '-' . str_pad(
                (string)(Transaction::whereDate('created_at', today())->count() + 1),
                3,
                '0',
                STR_PAD_LEFT
            );

            // Create transaction
            $transaction = Transaction::create([
                'company_id' => $validatedData['company_id'],
                'user_id' => auth()->id(),
                'transaction_number' => $transactionNumber,
                'subtotal' => $validatedData['subtotal'],
                'tax_amount' => $validatedData['tax_amount'],
                'discount_amount' => $validatedData['discount_amount'],
                'total_amount' => $validatedData['total_amount'],
                'paid_amount' => $validatedData['paid_amount'],
                'change_amount' => $validatedData['change_amount'],
                'payment_method' => $validatedData['payment_method'],
                'notes' => $validatedData['notes'] ?? null,
            ]);

            // Create transaction items and update stock
            foreach ($validatedData['items'] as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_code' => $product->code,
                    'unit_price' => $itemData['unit_price'],
                    'quantity' => $itemData['quantity'],
                    'subtotal' => $itemData['subtotal'],
                ]);

                // Update product stock
                $product->decrement('stock', $itemData['quantity']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'transaction' => $transaction->load('items'),
                'message' => 'Transaction completed successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to process transaction: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'company', 'items.product']);

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }


}