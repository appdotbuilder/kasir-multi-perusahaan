<?php

use App\Http\Controllers\CashierController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Main cashier interface (home page) - accessible without authentication for demo
Route::get('/', [CashierController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard redirects to cashier
    Route::get('dashboard', [CashierController::class, 'index'])->name('dashboard');
    
    // Cashier interface for authenticated users
    Route::get('cashier', [CashierController::class, 'index'])->name('cashier');

    // Company management
    Route::resource('companies', CompanyController::class);
    
    // Product management
    Route::resource('products', ProductController::class);
    
    // Transaction management
    Route::resource('transactions', TransactionController::class)->except(['edit', 'update']);
    
    // Receipt management
    Route::get('transactions/{transaction}/receipt', [ReceiptController::class, 'show'])
        ->name('transactions.receipt');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
