import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Download, Package, ArrowLeft } from "lucide-react";
import { useRoute, Link } from "wouter";
import { toast } from "sonner";

export default function APKDetail() {
  const [match, params] = useRoute("/apk/:id");
  const apkId = params?.id ? parseInt(params.id) : null;

  const { data: apk, isLoading } = trpc.apk.getById.useQuery(
    { id: apkId! },
    { enabled: !!apkId }
  );
  const downloadMutation = trpc.apk.download.useMutation();

  const handleDownload = async () => {
    if (!apk) return;
    try {
      const result = await downloadMutation.mutateAsync({ id: apk.id });
      if (result.url) {
        window.location.href = result.url;
        toast.success(`Downloading ${apk.name}...`);
      }
    } catch (error) {
      toast.error("Failed to download APK");
    }
  };

  if (!match) return <div>Not found</div>;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-500">Loading APK details...</p>
      </div>
    );
  }

  if (!apk) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to APKs
            </Button>
          </Link>
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              APK not found
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Go Sandy APK Hub</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to APKs
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="md:col-span-1">
            {apk.photoUrl ? (
              <img
                src={apk.photoUrl}
                alt={apk.name}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center h-64">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{apk.name}</CardTitle>
                <p className="text-lg text-gray-600 mt-2">Version {apk.version}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {apk.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {apk.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-gray-500">Downloads</p>
                    <p className="text-2xl font-bold">{apk.downloadCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">File Size</p>
                    <p className="text-2xl font-bold">
                      {apk.fileSize ? `${(apk.fileSize / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full py-6 text-lg"
                    onClick={handleDownload}
                    disabled={downloadMutation.isPending}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {downloadMutation.isPending ? "Downloading..." : "Download APK"}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    By downloading, you agree to our terms and conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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
