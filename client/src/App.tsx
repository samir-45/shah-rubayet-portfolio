import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import AdminMessages from "@/pages/admin/Messages";
import AdminOverview from "@/pages/admin/Overview";
import AdminProcess from "@/pages/admin/Process";
import AdminProfile from "@/pages/admin/Profile";
import AdminProjects from "@/pages/admin/Projects";
import AdminServices from "@/pages/admin/Services";
import AdminSkills from "@/pages/admin/Skills";
import AdminSocial from "@/pages/admin/Social";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminTools from "@/pages/admin/Tools";
import AdminCertifications from "@/pages/admin/Certifications";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminOverview} />
      <Route path="/admin/profile" component={AdminProfile} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/certifications" component={AdminCertifications} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/process" component={AdminProcess} />
      <Route path="/admin/skills" component={AdminSkills} />
      <Route path="/admin/tools" component={AdminTools} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />
      <Route path="/admin/social" component={AdminSocial} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
