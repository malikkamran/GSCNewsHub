import { useParams } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";
import { Helmet } from "react-helmet";

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id ? parseInt(params.id, 10) : undefined;

  return (
    <AdminLayout>
      <Helmet>
        <title>Edit Article | GSC Supply Chain News CMS</title>
      </Helmet>
      <ArticleForm articleId={articleId} />
    </AdminLayout>
  );
}