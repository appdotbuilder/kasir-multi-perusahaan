<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Transaction>
     */
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 10000, 1000000);
        $taxAmount = $subtotal * 0.1;
        $discountAmount = fake()->randomFloat(2, 0, $subtotal * 0.2);
        $totalAmount = $subtotal + $taxAmount - $discountAmount;
        $paidAmount = $totalAmount + fake()->randomFloat(2, 0, 50000);
        $changeAmount = $paidAmount - $totalAmount;

        return [
            'company_id' => Company::factory(),
            'user_id' => User::factory(),
            'transaction_number' => fake()->unique()->bothify('TRX-####-###'),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'change_amount' => $changeAmount,
            'payment_method' => fake()->randomElement(['cash', 'card', 'transfer']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}