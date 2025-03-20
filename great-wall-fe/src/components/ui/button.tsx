import * as React from "react";
import {ButtonHTMLAttributes, SyntheticEvent, useState} from "react";
import {Slot, Slottable} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {Loader2} from "lucide-react";

export const buttonVariantsBaseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

// https://enhanced-button.vercel.app/
const buttonVariants = cva(
  buttonVariantsBaseClass,
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
        unstyled: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "sm-icon": "h-8 w-8",
        "xs-icon": "h-4 w-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface IconProps {
  Icon?: React.ReactNode;
  iconPlacement?: "left" | "right";
}

export type ButtonIconProps = IconProps;

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> &
  VariantProps<typeof buttonVariants> & ButtonIconProps & {
  asChild?: boolean;
  loading?: boolean;
  onClick?: (e: SyntheticEvent<any>) => Promise<unknown> | unknown
  stopPropagation?: boolean
  preventDefault?: boolean
  type?: "null" | "submit" | "reset" | "button" | undefined;
  loaderClassName?: string;
  // 是否开启自动加载动画
  enableAutoLoading?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      Icon,
      iconPlacement = "right",
      type = "button",
      loading = false,
      disabled,
      onClick,
      stopPropagation = false,
      preventDefault = false,
      loaderClassName,
      enableAutoLoading = true,
      ...props
    },
    ref
  ) => {
    const [clickLoading, setClickLoading] = useState<boolean>(false)

    async function handleClick(e: SyntheticEvent<any>) {
      if (stopPropagation) {
        e.stopPropagation()
      }

      if (preventDefault) {
        e.preventDefault()
      }

      try {
        if (enableAutoLoading) {
          setClickLoading(true)
        }
        await onClick?.(e)
      } finally {
        if (enableAutoLoading) {
          setClickLoading(false)
        }
      }
    }

    const butType = type === "null" ? undefined : type
    const internalLoading = loading || clickLoading;
    const internalDisabled = disabled || internalLoading;
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        {...props}
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        type={butType}
        onClick={handleClick}
        disabled={internalDisabled}
      >
        {Icon && iconPlacement === "left" && (
          <div className="mr-1">
            {internalLoading ? (<Loader2 className={cn("h-4 w-4 animate-spin", loaderClassName)}/>) : Icon}
          </div>
        )}
        {(internalLoading && !Icon) && (<Loader2 className={cn("mr-1 h-4 w-4 animate-spin", loaderClassName)}/>)}
        <Slottable>
          {props.children}
        </Slottable>
        {Icon && iconPlacement === "right" && (
          <div className="ml-1">
            {internalLoading ? (<Loader2 className={cn("h-4 w-4 animate-spin", loaderClassName)}/>) : Icon}
          </div>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export {Button, buttonVariants};
