import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Download, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function APKListing() {
  const { data: apks, isLoading } = trpc.apk.list.useQuery();
  const { data: categories } = trpc.category.list.useQuery();
  const downloadMutation = trpc.apk.download.useMutation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredApks = selectedCategory
    ? apks?.filter((apk) => apk.categoryId === selectedCategory)
    : apks;

  const handleDownload = async (apkId: number, apkName: string) => {
    try {
      const result = await downloadMutation.mutateAsync({ id: apkId });
      if (result.url) {
        window.location.href = result.url;
        toast.success(`Downloading ${apkName}...`);
      }
    } catch (error) {
      toast.error("Failed to download APK");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Go Sandy APK Hub</h1>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Download APKs for Go Sandy
          </h2>
          <p className="text-lg text-gray-600">
            Browse and download the latest APK files
          </p>
        </div>

        {/* Categories Filter */}
        {categories && categories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* APK Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Loading APKs...</p>
            </div>
          ) : filteredApks && filteredApks.length > 0 ? (
            filteredApks.map((apk) => (
              <Card key={apk.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {apk.photoUrl && (
                    <img
                      src={apk.photoUrl}
                      alt={apk.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <CardTitle className="text-xl">{apk.name}</CardTitle>
                  <p className="text-sm text-gray-500">v{apk.version}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apk.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {apk.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Downloads: {apk.downloadCount || 0}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleDownload(apk.id, apk.name)}
                      disabled={downloadMutation.isPending}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Link href={`/apk/${apk.id}`}>
                      <Button variant="outline" className="flex-1">
                        Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No APKs available</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p>&copy; 2025 Go Sandy APK Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
