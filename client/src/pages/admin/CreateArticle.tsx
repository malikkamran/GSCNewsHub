import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";
import { Helmet } from "react-helmet";

export default function CreateArticlePage() {
  return (
    <AdminLayout>
      <Helmet>
        <title>Create Article | GSC Supply Chain News CMS</title>
      </Helmet>
      <ArticleForm />
    </AdminLayout>
  );
}