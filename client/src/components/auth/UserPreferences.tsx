
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function UserPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState({
    notificationsEnabled: false,
    emailDigest: false,
    digestFrequency: "weekly",
    theme: "light"
  });

  // Fetch user preferences
  const { data, isLoading } = useQuery({
    queryKey: ['/api/user-preferences'],
    enabled: !!user,
  });
  
  // Extract user preferences from the response data
  const userPreferencesData = data?.preferences && data.preferences.length > 0 
    ? data.preferences[0] 
    : null;

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: typeof preferences) => {
      // If the user has selected specific categories, include categoryId
      // For now, we're storing preferences as general settings (not category-specific)
      const preferenceData = {
        userId: user?.id,
        notificationsEnabled: newPreferences.notificationsEnabled,
        emailDigest: newPreferences.emailDigest,
        digestFrequency: newPreferences.digestFrequency,
        theme: newPreferences.theme
      };
      
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferenceData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-preferences'] });
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (userPreferences) {
      setPreferences(userPreferences);
    }
  }, [userPreferences]);

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    // Update the local state first
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    // Then send to server
    updatePreferences.mutate(newPreferences);
    
    // Log to ensure we're sending the right values
    console.log(`Updating ${key} to ${value}`, newPreferences);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive news and updates notifications</p>
          </div>
          <Switch
            checked={preferences.notificationsEnabled}
            onCheckedChange={(checked) => handlePreferenceChange('notificationsEnabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium">Email Digest</h3>
            <p className="text-sm text-muted-foreground">Receive email summaries of top stories</p>
          </div>
          <Switch
            checked={preferences.emailDigest}
            onCheckedChange={(checked) => handlePreferenceChange('emailDigest', checked)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Digest Frequency</h3>
          <Select
            value={preferences.digestFrequency}
            onValueChange={(value) => handlePreferenceChange('digestFrequency', value)}
            disabled={!preferences.emailDigest}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Theme</h3>
          <Select
            value={preferences.theme}
            onValueChange={(value) => handlePreferenceChange('theme', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
