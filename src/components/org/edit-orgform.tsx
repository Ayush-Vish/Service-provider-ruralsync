import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, FormEvent } from "react";

interface OrgData {
  name: string;
  phone: string;
  description: string;
}

interface EditOrganizationFormProps {
  orgData: OrgData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export default function EditOrganizationForm({
  orgData,
  handleInputChange,
  handleSubmit,
  setIsEditing,
}: EditOrganizationFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="orgName">Organization Name</Label>
          <Input
            id="orgName"
            name="orgName"
            value={orgData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={orgData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={orgData.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex gap-4">
        <Button type="submit">Update Organization</Button>
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}