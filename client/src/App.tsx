import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Legal from "./pages/Legal";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomCursor from "./components/CustomCursor";
import CookieConsent from "./components/CookieConsent";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/legal"} component={Legal} />
      <Route path={"/product/:slug"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="nights">
        <CurrencyProvider>
          <CartProvider>
            <TooltipProvider>
              <div className="noise-overlay">
                <CustomCursor />
                <Toaster />
                <Router />
                <CookieConsent />
              </div>
            </TooltipProvider>
          </CartProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
