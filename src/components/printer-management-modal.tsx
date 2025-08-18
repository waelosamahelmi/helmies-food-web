import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { thermalPrinterService, type ThermalPrinter } from "@/lib/thermal-printer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Printer, 
  Wifi, 
  Bluetooth, 
  Usb, 
  Search, 
  Plus, 
  Trash2, 
  TestTube,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface PrinterManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrinterManagementModal({ isOpen, onClose }: PrinterManagementModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [printers, setPrinters] = useState<ThermalPrinter[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrinter, setNewPrinter] = useState<{
    name: string;
    type: "network" | "bluetooth" | "usb";
    address: string;
  }>({
    name: "",
    type: "network",
    address: ""
  });

  useEffect(() => {
    if (isOpen) {
      loadPrinters();
    }
  }, [isOpen]);

  const loadPrinters = () => {
    setPrinters(thermalPrinterService.getPrinters());
  };

  const handleScanNetwork = async () => {
    setIsScanning(true);
    try {
      const networkPrinters = await thermalPrinterService.scanNetworkPrinters();
      networkPrinters.forEach(printer => {
        thermalPrinterService.addPrinter(printer);
      });
      loadPrinters();
      toast({
        title: t("Verkkoskannaus valmis", "Network scan complete"),
        description: t(`Löydettiin ${networkPrinters.length} tulostinta`, `Found ${networkPrinters.length} printers`),
      });
    } catch (error) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Verkkoskannaus epäonnistui", "Network scan failed"),
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanBluetooth = async () => {
    setIsScanning(true);
    try {
      const bluetoothPrinters = await thermalPrinterService.scanBluetoothPrinters();
      loadPrinters();
      toast({
        title: t("Bluetooth-skannaus valmis", "Bluetooth scan complete"),
        description: t(`Löydettiin ${bluetoothPrinters.length} tulostinta`, `Found ${bluetoothPrinters.length} printers`),
      });
    } catch (error) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Bluetooth-skannaus epäonnistui", "Bluetooth scan failed"),
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddPrinter = () => {
    if (!newPrinter.name || !newPrinter.address) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Täytä kaikki kentät", "Please fill all fields"),
        variant: "destructive",
      });
      return;
    }

    thermalPrinterService.addPrinter({
      ...newPrinter,
      status: 'disconnected' as const,
      paperStatus: 'ok' as const
    });
    loadPrinters();
    setShowAddForm(false);
    setNewPrinter({ name: "", type: "network", address: "" });
    
    toast({
      title: t("Tulostin lisätty", "Printer added"),
      description: t("Tulostin lisätty onnistuneesti", "Printer added successfully"),
    });
  };

  const handleRemovePrinter = (printerId: string) => {
    if (confirm(t("Haluatko varmasti poistaa tämän tulostimen?", "Are you sure you want to remove this printer?"))) {
      thermalPrinterService.removePrinter(printerId);
      loadPrinters();
      toast({
        title: t("Tulostin poistettu", "Printer removed"),
        description: t("Tulostin poistettu onnistuneesti", "Printer removed successfully"),
      });
    }
  };

  const handleTestPrinter = async (printerId: string) => {
    setIsTesting(printerId);
    try {
      const success = await thermalPrinterService.testPrinter(printerId);
      toast({
        title: success ? t("Testi onnistui", "Test successful") : t("Testi epäonnistui", "Test failed"),
        description: success ? 
          t("Tulostin toimii oikein", "Printer is working correctly") :
          t("Tulostimessa on ongelma", "Printer has an issue"),
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: t("Virhe", "Error"),
        description: t("Tulostimen testaus epäonnistui", "Printer test failed"),
        variant: "destructive",
      });
    } finally {
      setIsTesting(null);
    }
  };

  const getStatusIcon = (printer: ThermalPrinter) => {
    switch (printer.status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'network':
        return <Wifi className="w-4 h-4" />;
      case 'bluetooth':
        return <Bluetooth className="w-4 h-4" />;
      case 'usb':
        return <Usb className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Printer className="w-5 h-5" />
            <span>{t("Tulostinhallinta", "Printer Management")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scanner Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleScanNetwork}
              disabled={isScanning}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Wifi className="w-4 h-4" />
              <span>{t("Skannaa verkko", "Scan Network")}</span>
              {isScanning && <RefreshCw className="w-4 h-4 animate-spin" />}
            </Button>
            
            <Button
              onClick={handleScanBluetooth}
              disabled={isScanning}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Bluetooth className="w-4 h-4" />
              <span>{t("Skannaa Bluetooth", "Scan Bluetooth")}</span>
            </Button>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t("Lisää manuaalisesti", "Add Manually")}</span>
            </Button>
          </div>

          {/* Add Printer Form */}
          {showAddForm && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-sm">
                  {t("Lisää tulostin manuaalisesti", "Add Printer Manually")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="printerName">
                      {t("Nimi", "Name")}
                    </Label>
                    <Input
                      id="printerName"
                      value={newPrinter.name}
                      onChange={(e) => setNewPrinter(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t("Tulostimen nimi", "Printer name")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="printerType">
                      {t("Tyyppi", "Type")}
                    </Label>
                    <Select 
                      value={newPrinter.type} 
                      onValueChange={(value: "network" | "bluetooth" | "usb") => 
                        setNewPrinter(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="network">
                          <div className="flex items-center space-x-2">
                            <Wifi className="w-4 h-4" />
                            <span>{t("Verkko", "Network")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bluetooth">
                          <div className="flex items-center space-x-2">
                            <Bluetooth className="w-4 h-4" />
                            <span>Bluetooth</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="usb">
                          <div className="flex items-center space-x-2">
                            <Usb className="w-4 h-4" />
                            <span>USB</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="printerAddress">
                      {t("Osoite", "Address")}
                    </Label>
                    <Input
                      id="printerAddress"
                      value={newPrinter.address}
                      onChange={(e) => setNewPrinter(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={
                        newPrinter.type === 'network' ? "192.168.1.100" :
                        newPrinter.type === 'bluetooth' ? "Device ID" :
                        "COM1"
                      }
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleAddPrinter} size="sm">
                    {t("Lisää", "Add")}
                  </Button>
                  <Button 
                    onClick={() => setShowAddForm(false)} 
                    variant="outline" 
                    size="sm"
                  >
                    {t("Peruuta", "Cancel")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Printers List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold dark:text-white">
              {t("Löydetyt tulostimet", "Discovered Printers")} ({printers.length})
            </h3>
            
            {printers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <Printer className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>{t("Ei löydetty tulostimia", "No printers found")}</p>
                  <p className="text-sm mt-2">
                    {t("Käytä skannaustyökaluja tai lisää tulostin manuaalisesti", "Use scan tools or add printer manually")}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {printers.map((printer) => (
                  <Card key={printer.id} className="dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(printer.type)}
                            {getStatusIcon(printer)}
                          </div>
                          
                          <div>
                            <h4 className="font-medium dark:text-white">
                              {printer.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {printer.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={printer.status === 'connected' ? 'default' : 'secondary'}
                            className={
                              printer.status === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                              printer.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }
                          >
                            {printer.status === 'connected' ? t("Yhdistetty", "Connected") :
                             printer.status === 'error' ? t("Virhe", "Error") :
                             t("Yhteys katkennut", "Disconnected")}
                          </Badge>

                          <Badge 
                            variant="outline"
                            className={
                              printer.paperStatus === 'ok' ? 'border-green-300 text-green-800 dark:text-green-300' :
                              printer.paperStatus === 'low' ? 'border-yellow-300 text-yellow-800 dark:text-yellow-300' :
                              'border-red-300 text-red-800 dark:text-red-300'
                            }
                          >
                            {printer.paperStatus === 'ok' ? t("Paperi OK", "Paper OK") :
                             printer.paperStatus === 'low' ? t("Paperi vähissä", "Paper Low") :
                             t("Paperi loppu", "Paper Empty")}
                          </Badge>

                          <Button
                            onClick={() => handleTestPrinter(printer.id)}
                            disabled={isTesting === printer.id}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            {isTesting === printer.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <TestTube className="w-4 h-4" />
                            )}
                            <span>{t("Testaa", "Test")}</span>
                          </Button>

                          <Button
                            onClick={() => handleRemovePrinter(printer.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Print Test Options */}
          {printers.some(p => p.status === 'connected') && (
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardHeader>
                <CardTitle className="text-sm text-blue-800 dark:text-blue-200">
                  {t("Tulostusasetukset", "Print Settings")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  {t("Yhdistetyt tulostimet tulоставat automaattisesti kuitit ja keittiötilaukset.", "Connected printers will automatically print receipts and kitchen orders.")}
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>{t("Kuitit:", "Receipts:")}</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("Asiakaskuitit", "Customer receipts")}
                    </p>
                  </div>
                  <div>
                    <strong>{t("Keittiö:", "Kitchen:")}</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("Tilausohjeet", "Order instructions")}
                    </p>
                  </div>
                  <div>
                    <strong>{t("Tarrat:", "Labels:")}</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("Toimitustarrat", "Delivery labels")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}