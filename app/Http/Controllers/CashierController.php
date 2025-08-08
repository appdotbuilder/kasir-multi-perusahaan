<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Product;
use App\Models\Transaction;
use Inertia\Inertia;

class CashierController extends Controller
{
    /**
     * Display the main cashier interface.
     */
    public function index()
    {
        // Show welcome page if user is not authenticated
        if (!auth()->check()) {
            return Inertia::render('welcome');
        }

        $companies = Company::active()->with(['products' => function ($query) {
            $query->active()->orderBy('name');
        }])->orderBy('name')->get();

        $recentTransactions = Transaction::with(['user', 'company'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('cashier', [
            'companies' => $companies,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}