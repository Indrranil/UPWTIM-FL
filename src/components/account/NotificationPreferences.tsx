import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface NotificationPreferencesProps {
  userId: string;
}

interface Preferences {
  claimReceived: boolean;
  claimUpdated: boolean;
  matchFound: boolean;
  itemRecovered: boolean;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  userId,
}) => {
  const [preferences, setPreferences] = useState<Preferences>({
    claimReceived: true,
    claimUpdated: true,
    matchFound: true,
    itemRecovered: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/notifications/preferences");
        setPreferences(response.data);
      } catch (error) {
        console.error("Error fetching notification preferences:", error);
        toast({
          title: "Error",
          description: "Failed to load notification preferences",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleToggle = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      await axios.put("/notifications/preferences", preferences);
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Manage your email notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="claim-received" className="font-medium">
                Claim Received
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone claims your item
              </p>
            </div>
            <Switch
              id="claim-received"
              checked={preferences.claimReceived}
              onCheckedChange={() => handleToggle("claimReceived")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="claim-updated" className="font-medium">
                Claim Status Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your claim is approved or rejected
              </p>
            </div>
            <Switch
              id="claim-updated"
              checked={preferences.claimUpdated}
              onCheckedChange={() => handleToggle("claimUpdated")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="match-found" className="font-medium">
                Potential Matches
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a potential match is found for your item
              </p>
            </div>
            <Switch
              id="match-found"
              checked={preferences.matchFound}
              onCheckedChange={() => handleToggle("matchFound")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="item-recovered" className="font-medium">
                Item Recovery
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your item is marked as recovered
              </p>
            </div>
            <Switch
              id="item-recovered"
              checked={preferences.itemRecovered}
              onCheckedChange={() => handleToggle("itemRecovered")}
            />
          </div>
        </div>

        <Button onClick={savePreferences} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
