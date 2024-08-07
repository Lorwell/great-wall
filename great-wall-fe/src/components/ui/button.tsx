import * as React from "react"
import {SyntheticEvent, useState} from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"
import {Loader2} from 'lucide-react';
import {cn} from "@/utils/shadcnUtils"
import {isNull} from "@/utils/Utils.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        iconBorder: "h-10 w-10",
        icon: "h-10 w-10 border-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  onClick?: (event: SyntheticEvent) => void | Promise<void>
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
     className,
     variant,
     size,
     type = "button",
     asChild = false,
     loading = false,
     children,
     onClick,
     ...props
   }, ref) => {

    const [clickLoading, setClickLoading] = useState<boolean>(false);

    async function handleClick(event: SyntheticEvent) {
      if (isNull(onClick)) return

      setClickLoading(true);

      try {
        await onClick!!(event)
      } finally {
        setClickLoading(false);
      }
    }

    const loadingState = loading || clickLoading

    if (asChild) {
      return (
        <>
          {
            loadingState && (
              <Loader2 className={cn('h-4 w-4 animate-spin', children && 'mr-2')}/>
            )
          }
          <Slot
            className={cn(buttonVariants({variant, size, className}))}
            ref={ref}
            onClick={handleClick}
            {...props}
          >
            {children}
          </Slot>
        </>
      );
    }

    return (
      <button
        className={cn(buttonVariants({variant, size, className}))}
        disabled={loadingState}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {loadingState && <Loader2 className={cn('h-4 w-4 animate-spin', children && 'mr-2')}/>}
        {children}
      </button>
    );
  }
)

Button.displayName = "Button"

export {Button, buttonVariants}
