import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Key, ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string | null;
  onSetApiKey: (key: string) => void;
  onTestApiKey: (key: string) => Promise<boolean>;
  isValidKey: boolean;
  isTestingKey: boolean;
  onClearApiKey: () => void;
}

const ApiKeySetup = ({
  isOpen,
  onClose,
  currentApiKey,
  onSetApiKey,
  onTestApiKey,
  isValidKey,
  isTestingKey,
  onClearApiKey,
}: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasTestedKey, setHasTestedKey] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    
    setHasTestedKey(true);
    const isValid = await onTestApiKey(apiKey.trim());
    
    if (isValid) {
      onSetApiKey(apiKey.trim());
      onClose();
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setHasTestedKey(true);
    await onTestApiKey(apiKey.trim());
  };

  const handleClear = () => {
    onClearApiKey();
    setApiKey("");
    setHasTestedKey(false);
    onClose();
  };

  const getStatusIcon = () => {
    if (isTestingKey) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
    if (hasTestedKey) {
      return isValidKey ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      );
    }
    return null;
  };

  const getStatusText = () => {
    if (isTestingKey) return "Testing API key...";
    if (hasTestedKey) {
      return isValidKey ? "API key is valid!" : "API key is invalid";
    }
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Claude API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your Claude API key to enable AI-powered research analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Your API key is stored locally in your browser and never sent to our servers.
              Get your API key from{" "}
              <a 
                href="https://console.anthropic.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
              >
                Anthropic Console
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="apiKey">Claude API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-ant-api03-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {getStatusIcon()}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-8 w-8 p-0"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {getStatusText() && (
              <p className={`text-sm ${
                isValidKey ? "text-green-600" : "text-red-600"
              }`}>
                {getStatusText()}
              </p>
            )}
          </div>

          {currentApiKey && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">API key configured</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-red-600 hover:text-red-700"
              >
                Clear Key
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleTest}
            disabled={!apiKey.trim() || isTestingKey}
            variant="outline"
          >
            {isTestingKey ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Key"
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!apiKey.trim() || isTestingKey || (hasTestedKey && !isValidKey)}
            className="bg-gradient-to-r from-vc-primary to-vc-secondary"
          >
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySetup;
