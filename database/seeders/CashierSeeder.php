<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CashierSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create sample companies
        $companies = [
            [
                'name' => 'Toko Elektronik Maju',
                'address' => 'Jl. Elektronik No. 123, Jakarta',
                'phone' => '021-12345678',
                'email' => 'info@elektronik-maju.com',
                'description' => 'Toko elektronik terlengkap di Jakarta',
                'status' => 'active'
            ],
            [
                'name' => 'Warung Sembako Bahagia',
                'address' => 'Jl. Raya No. 456, Bandung',
                'phone' => '022-87654321',
                'email' => 'bahagia@sembako.com',
                'description' => 'Warung sembako kebutuhan sehari-hari',
                'status' => 'active'
            ],
            [
                'name' => 'Apotek Sehat Sentosa',
                'address' => 'Jl. Kesehatan No. 789, Surabaya',
                'phone' => '031-11223344',
                'email' => 'apotek@sehatsentosa.com',
                'description' => 'Apotek terpercaya dengan obat berkualitas',
                'status' => 'active'
            ]
        ];

        foreach ($companies as $companyData) {
            $company = Company::create($companyData);

            // Create admin user for each company
            User::create([
                'name' => 'Admin ' . $company->name,
                'email' => 'admin@' . strtolower(str_replace(' ', '', $company->name)) . '.com',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'role' => 'admin'
            ]);

            // Create cashier user for each company
            User::create([
                'name' => 'Kasir ' . $company->name,
                'email' => 'kasir@' . strtolower(str_replace(' ', '', $company->name)) . '.com',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'role' => 'cashier'
            ]);

            // Create products based on company type
            if (str_contains($company->name, 'Elektronik')) {
                $this->createElectronicsProducts($company);
            } elseif (str_contains($company->name, 'Sembako')) {
                $this->createGroceryProducts($company);
            } else {
                $this->createPharmacyProducts($company);
            }
        }

        // Create a demo user without company (can access all companies)
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@kasir.com',
            'password' => Hash::make('password'),
            'company_id' => null,
            'role' => 'admin'
        ]);
    }

    public function createElectronicsProducts(Company $company): void
    {
        $products = [
            ['name' => 'Smartphone Samsung Galaxy', 'price' => 3500000, 'stock' => 25, 'unit' => 'pcs'],
            ['name' => 'Laptop ASUS VivoBook', 'price' => 7500000, 'stock' => 10, 'unit' => 'pcs'],
            ['name' => 'Headphone Sony WH-1000XM4', 'price' => 4200000, 'stock' => 15, 'unit' => 'pcs'],
            ['name' => 'Mouse Wireless Logitech', 'price' => 350000, 'stock' => 30, 'unit' => 'pcs'],
            ['name' => 'Keyboard Mechanical', 'price' => 850000, 'stock' => 20, 'unit' => 'pcs'],
            ['name' => 'Monitor LED 24 inch', 'price' => 2100000, 'stock' => 12, 'unit' => 'pcs'],
            ['name' => 'Power Bank 10000mAh', 'price' => 250000, 'stock' => 40, 'unit' => 'pcs'],
            ['name' => 'Speaker Bluetooth JBL', 'price' => 1200000, 'stock' => 18, 'unit' => 'pcs']
        ];

        foreach ($products as $index => $product) {
            Product::create([
                'company_id' => $company->id,
                'name' => $product['name'],
                'code' => 'ELK-' . str_pad((string)($index + 1), 3, '0', STR_PAD_LEFT),
                'description' => 'Produk elektronik berkualitas tinggi',
                'price' => $product['price'],
                'stock' => $product['stock'],
                'unit' => $product['unit'],
                'status' => 'active'
            ]);
        }
    }

    public function createGroceryProducts(Company $company): void
    {
        $products = [
            ['name' => 'Beras Premium 5kg', 'price' => 65000, 'stock' => 50, 'unit' => 'kg'],
            ['name' => 'Minyak Goreng 2L', 'price' => 28000, 'stock' => 30, 'unit' => 'botol'],
            ['name' => 'Gula Pasir 1kg', 'price' => 15000, 'stock' => 40, 'unit' => 'kg'],
            ['name' => 'Tepung Terigu 1kg', 'price' => 12000, 'stock' => 35, 'unit' => 'kg'],
            ['name' => 'Kecap Manis 600ml', 'price' => 18000, 'stock' => 25, 'unit' => 'botol'],
            ['name' => 'Mie Instan', 'price' => 3000, 'stock' => 100, 'unit' => 'pcs'],
            ['name' => 'Sabun Mandi', 'price' => 8000, 'stock' => 60, 'unit' => 'pcs'],
            ['name' => 'Detergen 1kg', 'price' => 22000, 'stock' => 20, 'unit' => 'kg']
        ];

        foreach ($products as $index => $product) {
            Product::create([
                'company_id' => $company->id,
                'name' => $product['name'],
                'code' => 'SMB-' . str_pad((string)($index + 1), 3, '0', STR_PAD_LEFT),
                'description' => 'Kebutuhan sembako sehari-hari',
                'price' => $product['price'],
                'stock' => $product['stock'],
                'unit' => $product['unit'],
                'status' => 'active'
            ]);
        }
    }

    public function createPharmacyProducts(Company $company): void
    {
        $products = [
            ['name' => 'Paracetamol 500mg', 'price' => 5000, 'stock' => 100, 'unit' => 'strip'],
            ['name' => 'Vitamin C 1000mg', 'price' => 25000, 'stock' => 50, 'unit' => 'botol'],
            ['name' => 'Betadine 60ml', 'price' => 35000, 'stock' => 30, 'unit' => 'botol'],
            ['name' => 'Hansaplast 10s', 'price' => 12000, 'stock' => 40, 'unit' => 'box'],
            ['name' => 'Antasida Tablet', 'price' => 8000, 'stock' => 60, 'unit' => 'strip'],
            ['name' => 'Thermometer Digital', 'price' => 85000, 'stock' => 15, 'unit' => 'pcs'],
            ['name' => 'Masker Medis 50pcs', 'price' => 45000, 'stock' => 25, 'unit' => 'box'],
            ['name' => 'Hand Sanitizer 100ml', 'price' => 18000, 'stock' => 35, 'unit' => 'botol']
        ];

        foreach ($products as $index => $product) {
            Product::create([
                'company_id' => $company->id,
                'name' => $product['name'],
                'code' => 'APT-' . str_pad((string)($index + 1), 3, '0', STR_PAD_LEFT),
                'description' => 'Produk kesehatan dan obat-obatan',
                'price' => $product['price'],
                'stock' => $product['stock'],
                'unit' => $product['unit'],
                'status' => 'active'
            ]);
        }
    }
}