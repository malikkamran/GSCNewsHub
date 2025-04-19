import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";

export default function AdminCreateArticle() {
  return (
    <AdminLayout>
      <Helmet>
        <title>Create Article | GSC Supply Chain News CMS</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Article</h1>
        <p className="text-gray-600">Add a new article to the website</p>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border p-6">
        <ArticleForm />
      </div>
    </AdminLayout>
  );
}