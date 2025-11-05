import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { data: apks, isLoading: apksLoading, refetch: refetchApks } = trpc.apk.list.useQuery();
  const { data: categories } = trpc.category.list.useQuery();
  
  const createMutation = trpc.apk.create.useMutation();
  const updateMutation = trpc.apk.update.useMutation();
  const deleteMutation = trpc.apk.delete.useMutation();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    version: "",
    categoryId: "",
    fileUrl: "",
    fileKey: "",
    photoUrl: "",
    photoKey: "",
  });

  if (loading) return <div>Loading...</div>;
  
  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-red-600">Access Denied. Admin only.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name || undefined,
          description: formData.description || undefined,
          version: formData.version || undefined,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
          photoUrl: formData.photoUrl || undefined,
          photoKey: formData.photoKey || undefined,
        });
        toast.success("APK updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
          version: formData.version,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
          fileUrl: formData.fileUrl,
          fileKey: formData.fileKey,
          photoUrl: formData.photoUrl || undefined,
          photoKey: formData.photoKey || undefined,
        });
        toast.success("APK created successfully");
      }
      
      setFormData({
        name: "",
        description: "",
        version: "",
        categoryId: "",
        fileUrl: "",
        fileKey: "",
        photoUrl: "",
        photoKey: "",
      });
      setEditingId(null);
      setIsOpen(false);
      refetchApks();
    } catch (error) {
      toast.error("Failed to save APK");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this APK?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("APK deleted successfully");
        refetchApks();
      } catch (error) {
        toast.error("Failed to delete APK");
      }
    }
  };

  const handleEdit = (apk: any) => {
    setFormData({
      name: apk.name,
      description: apk.description || "",
      version: apk.version,
      categoryId: apk.categoryId?.toString() || "",
      fileUrl: apk.fileUrl,
      fileKey: apk.fileKey,
      photoUrl: apk.photoUrl || "",
      photoKey: apk.photoKey || "",
    });
    setEditingId(apk.id);
    setIsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">APK Management</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  description: "",
                  version: "",
                  categoryId: "",
                  fileUrl: "",
                  fileKey: "",
                  photoUrl: "",
                  photoKey: "",
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add APK
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit APK" : "Add New APK"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">APK Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fileUrl">APK File URL *</Label>
                  <Input
                    id="fileUrl"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="fileKey">File Key (S3) *</Label>
                  <Input
                    id="fileKey"
                    value={formData.fileKey}
                    onChange={(e) => setFormData({ ...formData, fileKey: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="photoUrl">Photo URL</Label>
                  <Input
                    id="photoUrl"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="photoKey">Photo Key (S3)</Label>
                  <Input
                    id="photoKey"
                    value={formData.photoKey}
                    onChange={(e) => setFormData({ ...formData, photoKey: e.target.value })}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {editingId ? "Update APK" : "Create APK"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {apksLoading ? (
            <div>Loading APKs...</div>
          ) : apks && apks.length > 0 ? (
            apks.map((apk) => (
              <Card key={apk.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle>{apk.name}</CardTitle>
                    <p className="text-sm text-gray-500">Version {apk.version}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(apk)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(apk.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {apk.photoUrl && (
                    <img src={apk.photoUrl} alt={apk.name} className="w-32 h-32 object-cover rounded" />
                  )}
                  <p className="text-sm">{apk.description}</p>
                  <p className="text-xs text-gray-500">Downloads: {apk.downloadCount || 0}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No APKs yet. Create your first APK!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
