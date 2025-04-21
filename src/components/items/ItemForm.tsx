import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlusIcon } from "lucide-react";

// Define schema for item form
const itemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Please select a date"),
  location: z.string().optional(),
  status: z.enum(["lost", "found"]),
  secretQuestion: z.string().optional(),
  secretAnswer: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemFormProps {
  type: "lost" | "found";
}

const ItemForm: React.FC<ItemFormProps> = ({ type }) => {
  const { createItem, isLoading } = useItems();
  const navigate = useNavigate();
  const [includeSecretQuestion, setIncludeSecretQuestion] = useState(false);
  const [includeLocation, setIncludeLocation] = useState(true);

  // For mock image upload
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      status: type,
      secretQuestion: "",
      secretAnswer: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: ItemFormValues) => {
    // Add imageUrl from selectedImage if any
    if (selectedImage) {
      values.imageUrl = selectedImage;
    }

    // Prepare the item data with required fields
    const itemData = {
      title: values.title,
      description: values.description,
      category: values.category,
      date: values.date,
      status: values.status,
      // Optional fields
      location: includeLocation ? values.location : undefined,
      secretQuestion: includeSecretQuestion ? values.secretQuestion : undefined,
      secretAnswer: includeSecretQuestion ? values.secretAnswer : undefined,
      imageUrl: values.imageUrl || undefined,
    };

    const success = await createItem(itemData);
    if (success) {
      navigate("/dashboard");
    }
  };

  // Mock file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload
      setUploadProgress(0);

      // Create URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6">
          Report {type === "lost" ? "Lost" : "Found"} Item
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a brief title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the item in detail"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-location"
                    checked={includeLocation}
                    onCheckedChange={setIncludeLocation}
                  />
                  <label
                    htmlFor="include-location"
                    className="text-sm font-medium"
                  >
                    Include Location
                  </label>
                </div>

                {includeLocation && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LOCATIONS.map((location) => (
                              <SelectItem
                                key={location.value}
                                value={location.value}
                              >
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel>Upload Image</FormLabel>
                  <div className="mt-1 border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                    <div className="mb-4">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="max-h-40 max-w-full rounded-md"
                        />
                      ) : (
                        <ImagePlusIcon className="h-12 w-12 text-gray-300" />
                      )}
                    </div>

                    {uploadProgress > 0 && uploadProgress < 100 ? (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                        <div
                          className="bg-mitwpu-navy h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    ) : (
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          {selectedImage ? "Change Image" : "Select Image"}
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      Upload a clear image of the item (optional)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-secret-question"
                      checked={includeSecretQuestion}
                      onCheckedChange={setIncludeSecretQuestion}
                    />
                    <label
                      htmlFor="include-secret-question"
                      className="text-sm font-medium"
                    >
                      Include Secret Question
                    </label>
                  </div>

                  {includeSecretQuestion && (
                    <>
                      <FormField
                        control={form.control}
                        name="secretQuestion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret Question</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g., What was written on the item?"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This will help verify the owner of the item
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secretAnswer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret Answer</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Answer to your secret question"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-mitwpu-navy hover:bg-mitwpu-navy/90"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ItemForm;
