import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface AuthInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

export function AuthInput({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: AuthInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-foreground font-medium text-xs tracking-wide font-sans">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="bg-input/20 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-10 px-3 transition-colors text-sm rounded-none font-sans"
            />
          </FormControl>
          <FormMessage className="text-xs text-destructive mt-1" />
        </FormItem>
      )}
    />
  );
}
