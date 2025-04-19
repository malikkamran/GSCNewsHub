import { Helmet } from "react-helmet";
import { useParams } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const articleId = params.id ? parseInt(params.id, 10) : undefined;

  return (
    <AdminLayout>
      <Helmet>
        <title>Edit Article | GSC Supply Chain News CMS</title>
      </Helmet>
      
      {articleId && <ArticleForm articleId={articleId} />}
    </AdminLayout>
  );
}