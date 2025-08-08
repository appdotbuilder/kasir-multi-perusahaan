import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';

interface TransactionItem {
    id: number;
    product_name: string;
    product_code: string;
    unit_price: string;
    quantity: number;
    subtotal: string;
}

interface Transaction {
    id: number;
    transaction_number: string;
    subtotal: string;
    tax_amount: string;
    discount_amount: string;
    total_amount: string;
    paid_amount: string;
    change_amount: string;
    payment_method: string;
    notes: string | null;
    created_at: string;
    user: {
        name: string;
    };
    company: {
        name: string;
        address: string | null;
        phone: string | null;
    };
    items: TransactionItem[];
}

interface Props {
    transaction: Transaction;
    [key: string]: unknown;
}

export default function Receipt({ transaction }: Props) {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(parseFloat(amount));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        router.visit('/');
    };

    return (
        <>
            <Head title={`Struk - ${transaction.transaction_number}`} />
            
            {/* Print Buttons - Hidden during print */}
            <div className="no-print p-4 bg-gray-50 flex justify-between items-center">
                <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Kasir
                </Button>
                <Button onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Cetak Struk
                </Button>
            </div>

            {/* Receipt Content */}
            <div className="receipt-content max-w-sm mx-auto bg-white p-6 font-mono text-sm">
                {/* Company Header */}
                <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-4">
                    <h1 className="text-lg font-bold mb-1">{transaction.company.name}</h1>
                    {transaction.company.address && (
                        <p className="text-xs mb-1">{transaction.company.address}</p>
                    )}
                    {transaction.company.phone && (
                        <p className="text-xs mb-2">Telp: {transaction.company.phone}</p>
                    )}
                    <div className="text-xs">
                        <p>📅 {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                        <p>🕐 {new Date(transaction.created_at).toLocaleTimeString('id-ID')}</p>
                    </div>
                </div>

                {/* Transaction Info */}
                <div className="mb-4 text-xs">
                    <div className="flex justify-between">
                        <span>No. Transaksi:</span>
                        <span className="font-semibold">{transaction.transaction_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Kasir:</span>
                        <span>{transaction.user.name}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="border-t border-dashed border-gray-400 pt-2 mb-4">
                    {transaction.items.map((item, index) => (
                        <div key={item.id} className="mb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-semibold text-xs leading-tight">{item.product_name}</p>
                                    <p className="text-xs text-gray-600">{item.product_code}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-1">
                                <span>
                                    {item.quantity} x {formatCurrency(item.unit_price)}
                                </span>
                                <span className="font-semibold">
                                    {formatCurrency(item.subtotal)}
                                </span>
                            </div>
                            {index < transaction.items.length - 1 && (
                                <hr className="border-dotted border-gray-300 my-2" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-dashed border-gray-400 pt-4 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(transaction.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Pajak (10%):</span>
                        <span>{formatCurrency(transaction.tax_amount)}</span>
                    </div>
                    {parseFloat(transaction.discount_amount) > 0 && (
                        <div className="flex justify-between">
                            <span>Diskon:</span>
                            <span>-{formatCurrency(transaction.discount_amount)}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-400 pt-2 flex justify-between font-bold">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(transaction.total_amount)}</span>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="border-t border-dashed border-gray-400 pt-4 mt-4 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Metode Bayar:</span>
                        <span className="capitalize">
                            {transaction.payment_method === 'cash' ? '💵 Tunai' : 
                             transaction.payment_method === 'card' ? '💳 Kartu' : 
                             '🏦 Transfer'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Bayar:</span>
                        <span>{formatCurrency(transaction.paid_amount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Kembalian:</span>
                        <span>{formatCurrency(transaction.change_amount)}</span>
                    </div>
                </div>

                {/* Notes */}
                {transaction.notes && (
                    <div className="border-t border-dashed border-gray-400 pt-4 mt-4 text-xs">
                        <p className="mb-1">Catatan:</p>
                        <p className="text-gray-600">{transaction.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t border-dashed border-gray-400 pt-4 mt-6 text-center text-xs">
                    <p className="mb-2">🙏 Terima kasih atas kunjungan Anda!</p>
                    <p className="mb-1">Barang yang sudah dibeli</p>
                    <p className="mb-4">tidak dapat dikembalikan</p>
                    <div className="text-xs text-gray-500">
                        <p>💻 Powered by KasirPro</p>
                        <p>🌐 Sistem Kasir Multi-Perusahaan</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    
                    .receipt-content {
                        max-width: none;
                        margin: 0;
                        padding: 10mm;
                        font-size: 12px;
                        line-height: 1.3;
                    }
                    
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                }
            `}</style>
        </>
    );
}