
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { Item } from "@/types/item";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlusIcon } from "lucide-react";

// Define schema for claim form
const claimSchema = z.object({
  answer: z.string().optional(),
  justification: z.string().min(20, "Please provide a detailed justification of at least 20 characters"),
  proofImageUrl: z.string().optional(),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

interface ClaimFormProps {
  item: Item;
  onCancel: () => void;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ item, onCancel }) => {
  const { createClaim, isLoading } = useItems();
  const navigate = useNavigate();
  
  // For mock image upload
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      answer: "",
      justification: "",
      proofImageUrl: "",
    },
  });

  const onSubmit = async (values: ClaimFormValues) => {
    // Add proofImageUrl from selectedImage if any
    if (selectedImage) {
      values.proofImageUrl = selectedImage;
    }
    
    const success = await createClaim({
      itemId: item.id,
      justification: values.justification, // This is required
      answer: values.answer || undefined,
      proofImageUrl: values.proofImageUrl || undefined,
    });
    
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
        setUploadProgress(prev => {
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
        <h2 className="text-2xl font-bold mb-6">Claim This Item</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {item.secretQuestion && (
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Question: {item.secretQuestion}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your answer" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This is a verification question set by the finder to identify the rightful owner.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justification</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain why you believe this item belongs to you..." 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide specific details about the item that only the owner would know.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Upload Proof (Optional)</FormLabel>
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
                      onClick={() => document.getElementById("proof-upload")?.click()}
                    >
                      {selectedImage ? "Change Image" : "Select Image"}
                    </Button>
                    <input
                      id="proof-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image that shows you are the owner (e.g., a photo with the item)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-mitwpu-navy hover:bg-mitwpu-navy/90"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClaimForm;
