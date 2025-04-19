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
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import CookiePage from "@/pages/CookiePage";
import ContactPage from "@/pages/ContactPage";
import AdvertisePage from "@/pages/AdvertisePage";
import SearchPage from "@/pages/SearchPage";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

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
      <Route path="/auth" component={AuthPage}/>
      <Route path="/about" component={AboutPage}/>
      <Route path="/terms" component={TermsPage}/>
      <Route path="/privacy" component={PrivacyPage}/>
      <Route path="/cookies" component={CookiePage}/>
      <Route path="/contact" component={ContactPage}/>
      <Route path="/advertise" component={AdvertisePage}/>
      <Route path="/search" component={SearchPage}/>
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin}/>
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard}/>
      <ProtectedRoute path="/admin/articles" component={AdminArticles}/>
      <ProtectedRoute path="/admin/articles/create" component={AdminCreateArticle}/>
      <ProtectedRoute path="/admin/articles/edit/:id" component={AdminEditArticle}/>
      <ProtectedRoute path="/admin/categories" component={AdminCategories}/>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
