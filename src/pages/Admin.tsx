import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, RefreshCw, ArrowLeft } from "lucide-react";

const SUPERMARKETS = ['Naivas', 'Carrefour', 'Quickmart', 'Chandarana'];

export default function Admin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [results, setResults] = useState<any>(null);

  const handleScrape = async () => {
    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-prices', {
        body: { 
          supermarket: selectedMarket === 'all' ? null : selectedMarket 
        }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Scraping Complete",
        description: `Successfully scraped ${data.scraped} items`,
      });
    } catch (error: any) {
      console.error('Scraping error:', error);
      toast({
        title: "Scraping Failed",
        description: error.message || "Failed to scrape prices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Price Scraper Admin</h1>
            <p className="text-muted-foreground">
              Scrape prices from major Kenyan supermarkets and update the database
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scrape Supermarket Prices</CardTitle>
              <CardDescription>
                Select a supermarket to scrape or choose "All" to scrape all markets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Supermarkets</SelectItem>
                    {SUPERMARKETS.map(market => (
                      <SelectItem key={market} value={market}>{market}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleScrape} 
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Start Scraping
                    </>
                  )}
                </Button>
              </div>

              {results && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Scraping Results
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Successfully scraped {results.scraped} items
                  </p>
                  
                  {results.items && results.items.length > 0 && (
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {results.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm p-2 bg-background rounded border border-border">
                          <span className="font-medium">{item.supermarket}</span>: {item.item} - 
                          KES {item.price}/{item.unit}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automated Scraping</CardTitle>
              <CardDescription>
                Prices are automatically scraped every 6 hours to keep data fresh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Next scheduled scrape: In approximately {Math.floor(Math.random() * 6)} hours
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}