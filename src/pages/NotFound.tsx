import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-primary mb-2">404</CardTitle>
          <CardDescription className="text-lg">
            Сторінку не знайдено
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Вибачте, але сторінка, яку ви шукаєте, не існує.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            На головну
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
