import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import useLocation from "../../hooks/useLocation"

export default function RegistrationForm({ orgData, handleInputChange, handleSubmit }) {
  const { location, error } = useLocation()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Organization Name" name="orgName" value={orgData.orgName} onChange={handleInputChange} />
        <InputField label="Phone" name="phone" value={orgData.phone} onChange={handleInputChange} />
      </div>
      <TextareaField label="Description" name="description" value={orgData.description} onChange={handleInputChange} />
      <InputField label="Website" name="website" value={orgData.website} onChange={handleInputChange} />
      <InputField label="Latitude" value={location?.latitude || ''} readOnly />
      <InputField label="Longitude" value={location?.longitude || ''} readOnly />
      {error && <p>{error.message}</p>}
      <Button type="submit">Register Organization</Button>
    </form>
  )
}

function InputField({ label, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  )
}

function TextareaField({ label, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea {...props} />
    </div>
  )
}
