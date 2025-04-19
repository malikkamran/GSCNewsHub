import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminArticles from "@/pages/admin/Articles";
import AdminCreateArticle from "@/pages/admin/CreateArticle";
import AdminEditArticle from "@/pages/admin/EditArticle";
import AdminCategories from "@/pages/admin/Categories";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home}/>
      <Route path="/category/:slug" component={CategoryPage}/>
      <Route path="/article/:slug" component={ArticlePage}/>
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin}/>
      <Route path="/admin/dashboard" component={AdminDashboard}/>
      <Route path="/admin/articles" component={AdminArticles}/>
      <Route path="/admin/articles/create" component={AdminCreateArticle}/>
      <Route path="/admin/articles/edit/:id" component={AdminEditArticle}/>
      <Route path="/admin/categories" component={AdminCategories}/>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isAdminRoute ? (
          // Admin routes don't need the public site header/footer
          <main>
            <Router />
          </main>
        ) : (
          // Public site layout
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
