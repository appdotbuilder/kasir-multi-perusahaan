import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Building2, Receipt, Users, BarChart3, Shield, Zap, Star } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Kasir Multi-Perusahaan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-6 text-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100">
                {/* Header */}
                <header className="mb-8 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-600 p-2">
                                <ShoppingCart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">KasirPro</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Selamat datang, {auth.user.name}!
                                    </span>
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Daftar Gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <div className="w-full max-w-6xl text-center mb-16">
                    <div className="mb-8">
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            💰 Sistem Kasir Multi-Perusahaan
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Kelola transaksi penjualan untuk berbagai perusahaan dalam satu platform. 
                            Sistem kasir modern dengan fitur lengkap dan data yang terisolasi untuk setiap perusahaan.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Buka Aplikasi Kasir
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    <Star className="h-5 w-5" />
                                    Mulai Gratis Sekarang
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-8 py-4 text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <Users className="h-5 w-5" />
                                    Login ke Akun
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Screenshot Placeholder */}
                    <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-8 mb-16 shadow-xl dark:from-gray-800 dark:to-gray-700">
                        <div className="rounded-lg bg-white p-6 shadow-inner dark:bg-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/20">
                                    <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
                                    <h4 className="font-semibold mb-2">Interface Kasir</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Antarmuka kasir yang mudah digunakan</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 dark:bg-green-900/20">
                                    <Building2 className="h-8 w-8 text-green-600 mb-2" />
                                    <h4 className="font-semibold mb-2">Multi Perusahaan</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Data terpisah untuk setiap perusahaan</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 dark:bg-purple-900/20">
                                    <Receipt className="h-8 w-8 text-purple-600 mb-2" />
                                    <h4 className="font-semibold mb-2">Cetak Struk</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Struk penjualan otomatis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="w-full max-w-6xl mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">🚀 Fitur Unggulan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="rounded-lg bg-blue-100 p-3 w-fit mb-4 dark:bg-blue-900/30">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">🏢 Multi-Perusahaan</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Kelola data produk dan transaksi untuk beberapa perusahaan yang berbeda dengan data yang terisolasi.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="rounded-lg bg-green-100 p-3 w-fit mb-4 dark:bg-green-900/30">
                                <ShoppingCart className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">🛒 Manajemen Produk</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Tambah, edit, dan hapus produk dengan mudah. Kelola stok dan harga untuk setiap perusahaan.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="rounded-lg bg-purple-100 p-3 w-fit mb-4 dark:bg-purple-900/30">
                                <Receipt className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">🧾 Transaksi Penjualan</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Proses transaksi dengan cepat, hitung pajak otomatis, dan cetak struk penjualan.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="rounded-lg bg-orange-100 p-3 w-fit mb-4 dark:bg-orange-900/30">
                                <BarChart3 className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">📊 Laporan Penjualan</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Lihat riwayat transaksi dan analisis penjualan untuk setiap perusahaan secara terpisah.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="rounded-lg bg-red-100 p-3 w-fit mb-4 dark:bg-red-900/30">
                                <Shield className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">🔒 Keamanan Data</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Data setiap perusahaan terisolasi dengan sistem autentikasi yang aman.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="rounded-lg bg-yellow-100 p-3 w-fit mb-4 dark:bg-yellow-900/30">
                                <Zap className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">⚡ Performa Cepat</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Interface yang responsif dan cepat untuk mempercepat proses transaksi kasir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How it Works */}
                <div className="w-full max-w-4xl mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">📋 Cara Kerja</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/30">
                                <span className="text-2xl font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Pilih Perusahaan</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Pilih perusahaan yang akan digunakan untuk transaksi
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto mb-4 dark:bg-green-900/30">
                                <span className="text-2xl font-bold text-green-600">2</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Tambah Produk</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Pilih produk dan masukkan ke keranjang belanja
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="rounded-full bg-purple-100 w-16 h-16 flex items-center justify-center mx-auto mb-4 dark:bg-purple-900/30">
                                <span className="text-2xl font-bold text-purple-600">3</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Proses Pembayaran</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Hitung total, terima pembayaran, dan cetak struk
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                {!auth.user && (
                    <div className="w-full max-w-4xl bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
                        <h2 className="text-3xl font-bold mb-4">🎯 Siap Memulai?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Daftar sekarang dan mulai kelola kasir untuk perusahaan Anda!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-medium text-blue-600 hover:bg-gray-100 transition-colors"
                            >
                                <Star className="h-5 w-5" />
                                Daftar Gratis
                            </Link>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-lg border border-white px-8 py-4 text-lg font-medium text-white hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                <Users className="h-5 w-5" />
                                Sudah Punya Akun?
                            </Link>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© 2024 KasirPro - Sistem Kasir Multi-Perusahaan</p>
                    <p className="mt-2">
                        Dibuat dengan ❤️ menggunakan{" "}
                        <a 
                            href="https://laravel.com" 
                            target="_blank" 
                            className="font-medium text-red-500 hover:underline"
                        >
                            Laravel
                        </a>
                        {" "}dan{" "}
                        <a 
                            href="https://react.dev" 
                            target="_blank" 
                            className="font-medium text-blue-500 hover:underline"
                        >
                            React
                        </a>
                    </p>
                </footer>
            </div>
        </>
    );
}