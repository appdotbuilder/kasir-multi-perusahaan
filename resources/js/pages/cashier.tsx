import React, { useState, useCallback } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, Trash2, Receipt, Building2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Company {
    id: number;
    name: string;
    status: string;
    products: Product[];
}

interface Product {
    id: number;
    name: string;
    code: string;
    price: string;
    stock: number;
    unit: string;
    status: string;
}

interface Transaction {
    id: number;
    transaction_number: string;
    total_amount: string;
    created_at: string;
    user: {
        name: string;
    };
    company: {
        name: string;
    };
}

interface CartItem {
    product: Product;
    quantity: number;
    subtotal: number;
}

interface Props {
    companies: Company[];
    recentTransactions: Transaction[];
    [key: string]: unknown;
}

export default function Cashier({ companies, recentTransactions }: Props) {
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerPaid, setCustomerPaid] = useState<string>('');
    const [discount, setDiscount] = useState<string>('0');
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');

    const selectedCompany = companies.find(c => c.id.toString() === selectedCompanyId);
    const availableProducts = selectedCompany?.products.filter(p => p.status === 'active' && p.stock > 0) || [];

    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const discountAmount = parseFloat(discount) || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;
    const paidAmount = parseFloat(customerPaid) || 0;
    const changeAmount = Math.max(0, paidAmount - totalAmount);

    const addToCart = useCallback((product: Product) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.product.id === product.id);
            if (existingItem) {
                const newQuantity = existingItem.quantity + 1;
                if (newQuantity > product.stock) return prev;
                
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: newQuantity, subtotal: newQuantity * parseFloat(product.price) }
                        : item
                );
            }
            return [...prev, {
                product,
                quantity: 1,
                subtotal: parseFloat(product.price)
            }];
        });
    }, []);

    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCart(prev => prev.filter(item => item.product.id !== productId));
            return;
        }

        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const maxQuantity = item.product.stock;
                const quantity = Math.min(newQuantity, maxQuantity);
                return {
                    ...item,
                    quantity,
                    subtotal: quantity * parseFloat(item.product.price)
                };
            }
            return item;
        }));
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    }, []);

    const handleCheckout = async () => {
        if (!selectedCompanyId || cart.length === 0 || paidAmount < totalAmount) {
            return;
        }

        const transactionData = {
            company_id: parseInt(selectedCompanyId),
            subtotal: subtotal,
            tax_amount: taxAmount,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            paid_amount: paidAmount,
            change_amount: changeAmount,
            payment_method: paymentMethod,
            items: cart.map(item => ({
                product_id: item.product.id,
                unit_price: parseFloat(item.product.price),
                quantity: item.quantity,
                subtotal: item.subtotal
            }))
        };

        try {
            const response = await fetch('/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(transactionData)
            });

            const result = await response.json();

            if (result.success) {
                // Reset form
                setCart([]);
                setCustomerPaid('');
                setDiscount('0');
                
                // Redirect to receipt
                router.visit(`/transactions/${result.transaction.id}/receipt`);
            } else {
                alert('Failed to process transaction: ' + result.message);
            }
        } catch (error) {
            console.error('Transaction error:', error);
            alert('An error occurred while processing the transaction');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AppShell>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Column - Products */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                💰 Sistem Kasir Multi-Perusahaan
                            </CardTitle>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="company">Pilih Perusahaan</Label>
                                    <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                                        <SelectTrigger id="company">
                                            <SelectValue placeholder="Pilih perusahaan..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id.toString()}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {selectedCompany && (
                        <Card>
                            <CardHeader>
                                <CardTitle>🛍️ Daftar Produk - {selectedCompany.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {availableProducts.map((product) => (
                                        <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">{product.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Kode: {product.code}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-lg">
                                                            {formatCurrency(parseFloat(product.price))}
                                                        </span>
                                                        <Badge variant="secondary">
                                                            {product.stock} {product.unit}
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        className="w-full"
                                                        onClick={() => addToCart(product)}
                                                        disabled={product.stock === 0}
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Tambah ke Keranjang
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                
                                {availableProducts.length === 0 && selectedCompany && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Tidak ada produk tersedia untuk perusahaan ini</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Cart and Checkout */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                🛒 Keranjang Belanja
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    Keranjang kosong
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.product.id} className="border rounded-lg p-3 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatCurrency(parseFloat(item.product.price))} / {item.product.unit}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(item.product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <span className="font-semibold">
                                                    {formatCurrency(item.subtotal)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {cart.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>💳 Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="discount">Diskon (Rp)</Label>
                                    <Input
                                        id="discount"
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="payment-method">Metode Pembayaran</Label>
                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <SelectTrigger id="payment-method">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">💵 Tunai</SelectItem>
                                            <SelectItem value="card">💳 Kartu</SelectItem>
                                            <SelectItem value="transfer">🏦 Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Pajak (10%):</span>
                                        <span>{formatCurrency(taxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Diskon:</span>
                                        <span>-{formatCurrency(discountAmount)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span>{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="paid">Bayar (Rp)</Label>
                                    <Input
                                        id="paid"
                                        type="number"
                                        value={customerPaid}
                                        onChange={(e) => setCustomerPaid(e.target.value)}
                                        min="0"
                                        className={paidAmount < totalAmount ? 'border-red-300' : ''}
                                    />
                                </div>

                                {paidAmount > 0 && (
                                    <div className="flex justify-between font-semibold">
                                        <span>Kembalian:</span>
                                        <span className={changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {formatCurrency(changeAmount)}
                                        </span>
                                    </div>
                                )}

                                <Button
                                    className="w-full"
                                    onClick={handleCheckout}
                                    disabled={!selectedCompanyId || cart.length === 0 || paidAmount < totalAmount}
                                >
                                    <Receipt className="h-4 w-4 mr-2" />
                                    Proses Pembayaran
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📋 Transaksi Terakhir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentTransactions.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4 text-sm">
                                    Belum ada transaksi
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="border rounded p-3 text-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{transaction.transaction_number}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {transaction.company.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Kasir: {transaction.user.name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        {formatCurrency(parseFloat(transaction.total_amount))}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}