<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;

class ReceiptController extends Controller
{
    /**
     * Display the receipt for the specified transaction.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'company', 'items']);

        return Inertia::render('transactions/receipt', [
            'transaction' => $transaction,
        ]);
    }
}