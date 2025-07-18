import { useState, useEffect } from "react";
import { Phone, PhoneCall, PhoneOff, Settings, Mic, MicOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";

interface IVRCallManagerProps {
  onMedicationConfirmation?: (medication: string, taken: boolean) => void;
  onAppointmentReminder?: (appointment: string) => void;
  onHealthCheck?: (metrics: any) => void;
}

export function IVRCallManager({ 
  onMedicationConfirmation, 
  onAppointmentReminder, 
  onHealthCheck 
}: IVRCallManagerProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Call Connected",
        description: "IVR system is now active",
      });
    },
    onDisconnect: () => {
      toast({
        title: "Call Ended",
        description: "IVR session has been terminated",
      });
    },
    onError: (error) => {
      toast({
        title: "Call Error",
        description: `IVR error: ${error}`,
        variant: "destructive"
      });
    },
    clientTools: {
      confirmMedication: (parameters: { medication: string, taken: boolean }) => {
        onMedicationConfirmation?.(parameters.medication, parameters.taken);
        toast({
          title: "Medication Confirmed",
          description: `${parameters.medication} marked as ${parameters.taken ? 'taken' : 'not taken'}`,
        });
        return "Medication status updated successfully";
      },
      scheduleReminder: (parameters: { appointment: string, datetime: string }) => {
        onAppointmentReminder?.(parameters.appointment);
        toast({
          title: "Reminder Set",
          description: `Appointment reminder scheduled: ${parameters.appointment}`,
        });
        return "Reminder scheduled successfully";
      },
      recordHealthMetrics: (parameters: { sugar?: number, bp?: string, weight?: number }) => {
        onHealthCheck?.(parameters);
        toast({
          title: "Health Metrics Recorded",
          description: "Your health data has been updated",
        });
        return "Health metrics recorded successfully";
      }
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are Mirrome, a helpful health assistant that helps users confirm medications, set reminders, and record health metrics. 
          
          You can:
          1. Confirm medication intake using confirmMedication(medication, taken)
          2. Set appointment reminders using scheduleReminder(appointment, datetime)
          3. Record health metrics using recordHealthMetrics(sugar, bp, weight)
          
          Be friendly, concise, and health-focused. Always confirm actions before executing them.`
        },
        firstMessage: "Hi! This is Mirrome, your health assistant. How can I help you today? I can help you confirm medications, set reminders, or record health metrics.",
        language: "en"
      }
    }
  });

  const startCall = async () => {
    if (!agentId || !apiKey) {
      toast({
        title: "Configuration Required",
        description: "Please enter your ElevenLabs Agent ID and API Key",
        variant: "destructive"
      });
      return;
    }

    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start conversation with signed URL
      const response = await fetch('/api/elevenlabs/get-signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId, apiKey })
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signed_url } = await response.json();
      await conversation.startSession({ agentId });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: "Unable to start IVR call. Please check your configuration.",
        variant: "destructive"
      });
    }
  };

  const endCall = async () => {
    await conversation.endSession();
  };

  const toggleMute = async () => {
    // Volume control (0 = muted, 1 = full volume)
    const currentVolume = conversation.isSpeaking ? 0 : 1;
    await conversation.setVolume({ volume: currentVolume });
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          IVR Call Manager
          <Badge variant={conversation.status === "connected" ? "default" : "secondary"}>
            {conversation.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          Voice-based medication confirmation and health reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="ivr-enabled">Enable IVR Calls</Label>
            <Switch
              id="ivr-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          {isEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="agent-id">ElevenLabs Agent ID</Label>
                <Input
                  id="agent-id"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  placeholder="Enter your ElevenLabs Agent ID"
                  className="shadow-soft focus:shadow-sakura transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">ElevenLabs API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your ElevenLabs API Key"
                  className="shadow-soft focus:shadow-sakura transition-shadow"
                />
              </div>
            </>
          )}
        </div>

        {/* Call Controls */}
        {isEnabled && (
          <div className="flex items-center gap-2">
            {conversation.status === "disconnected" ? (
              <Button
                onClick={startCall}
                variant="sakura"
                className="flex-1"
                disabled={!agentId || !apiKey}
              >
                <PhoneCall className="h-4 w-4 mr-2" />
                Start Call
              </Button>
            ) : (
              <>
                <Button
                  onClick={endCall}
                  variant="destructive"
                  className="flex-1"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </Button>
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  size="sm"
                >
                  {conversation.isSpeaking ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Call Status */}
        {conversation.status === "connected" && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Call Active</span>
              {conversation.isSpeaking && (
                <Badge variant="secondary" className="ml-auto">
                  Speaking
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Say "confirm medication [name]" or "set reminder for [appointment]" to interact
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            IVR calls can help confirm medications, set reminders, and record health metrics through voice commands
          </p>
        </div>
      </CardContent>
    </Card>
  );
}