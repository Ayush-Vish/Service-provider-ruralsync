import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { OrganizationAPI, useOrgStore, Day, BusinessHour } from "@/stores/org.store";
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Globe, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Building2,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditOrganizationFormProps {
  orgData: OrganizationAPI;
  onCancel: () => void;
  onSuccess: () => void;
}

const DAYS: Day[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const CATEGORY_OPTIONS = [
  "Plumbing", "Electrical", "HVAC", "Appliance Repair", "Cleaning", 
  "Carpentry", "Painting", "Pest Control", "Landscaping", "Moving",
  "Home Security", "Roofing", "Flooring", "General Maintenance"
];

export default function EditOrganizationForm({ orgData, onCancel, onSuccess }: EditOrganizationFormProps) {
  const updateOrg = useOrgStore((state) => state.updateOrg);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: orgData.name || "",
    phone: orgData.phone || "",
    address: orgData.address || "",
    description: orgData.description || "",
    website: orgData.website || "",
    categories: orgData.categories || [],
    socialMedia: {
      facebook: orgData.socialMedia?.facebook || "",
      twitter: orgData.socialMedia?.twitter || "",
      instagram: orgData.socialMedia?.instagram || "",
      linkedin: orgData.socialMedia?.linkedin || "",
    },
    businessHours: orgData.businessHours || {} as Record<Day, BusinessHour>,
  });

  const [newCategory, setNewCategory] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const handleBusinessHoursChange = (day: Day, field: 'start' | 'end', value: string) => {
    setFormData(prev => {
      const currentHours = prev.businessHours[day];
      if (currentHours === "Closed") return prev;
      
      return {
        ...prev,
        businessHours: {
          ...prev.businessHours,
          [day]: {
            ...(typeof currentHours === 'object' ? currentHours : { start: "09:00", end: "17:00" }),
            [field]: value
          }
        }
      };
    });
  };

  const toggleDayClosed = (day: Day) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: prev.businessHours[day] === "Closed" ? { start: "09:00", end: "17:00" } : "Closed"
      }
    }));
  };

  const addCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await updateOrg(formData);
      if (success) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>Update your organization's basic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter organization name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                className="pl-10 min-h-[80px]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your organization and services..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Service Categories</CardTitle>
          <CardDescription>Select the categories of services you provide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.categories.map((category, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.filter(c => !formData.categories.includes(c)).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addCategory} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Business Hours
          </CardTitle>
          <CardDescription>Set your operating hours for each day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DAYS.map((day) => {
              const hours = formData.businessHours[day];
              const isClosed = hours === "Closed";
              
              return (
                <div key={day} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <span className="w-24 font-medium capitalize">{day}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!isClosed}
                      onCheckedChange={() => toggleDayClosed(day)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isClosed ? "Closed" : "Open"}
                    </span>
                  </div>
                  {!isClosed && (
                    <div className="flex items-center gap-2 ml-auto">
                      <Input
                        type="time"
                        value={typeof hours === 'object' ? hours.start : "09:00"}
                        onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={typeof hours === 'object' ? hours.end : "17:00"}
                        onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Add your social media profiles (optional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </Label>
              <Input
                value={formData.socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-sky-500" />
                Twitter
              </Label>
              <Input
                value={formData.socialMedia.twitter}
                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                Instagram
              </Label>
              <Input
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-700" />
                LinkedIn
              </Label>
              <Input
                value={formData.socialMedia.linkedin}
                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
