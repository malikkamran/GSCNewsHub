import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";

export default function AdminEditArticle() {
  // Get article ID from URL params
  const params = useParams<{ id: string }>();
  const articleId = params?.id ? parseInt(params.id, 10) : undefined;
  
  if (!articleId) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Article ID</h2>
          <p className="text-gray-600">The article ID provided is invalid.</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Edit Article | GSC Supply Chain News CMS</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Article</h1>
        <p className="text-gray-600">Make changes to an existing article</p>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border p-6">
        <ArticleForm articleId={articleId} />
      </div>
    </AdminLayout>
  );
}