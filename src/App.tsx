import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme-context";
import { RestaurantProvider } from "@/lib/restaurant-context";
import { useAdminAccess } from "@/hooks/use-admin-access";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";
import AdminPage from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAdminOpen, closeAdmin } = useAdminAccess();

  return (
    <QueryClientProvider client={queryClient}>
      <RestaurantProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
                {isAdminOpen && <AdminPage onClose={closeAdmin} />}
              </TooltipProvider>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </RestaurantProvider>
    </QueryClientProvider>
  );
}

export default App;
