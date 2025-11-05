import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Package, Shield, Download, Zap } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <Link href="/apks">
              <Button variant="ghost">Browse APKs</Button>
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline">Admin Panel</Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Go Sandy APK Hub
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Download the latest APK files for Go Sandy. Browse our collection,
          view detailed information, and get instant downloads.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/apks">
            <Button size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Browse APKs
            </Button>
          </Link>
          {!isAuthenticated && (
            <Button size="lg" variant="outline" asChild>
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Package className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Easy Downloads</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Download APKs with a single click. Fast and reliable downloads.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Latest Versions</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Always get the latest and greatest versions of your favorite apps.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Safe & Secure</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              All APKs are carefully curated and verified for your safety.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Section */}
      {isAuthenticated && user?.role === "admin" && (
        <section className="container mx-auto px-4 py-12 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Admin Tools</h3>
          <p className="text-gray-600 mb-6">
            Manage APKs, upload new versions, and track downloads.
          </p>
          <Link href="/admin">
            <Button>Go to Admin Panel</Button>
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p>&copy; 2025 Go Sandy APK Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
