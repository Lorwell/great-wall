import * as React from "react";
import {IconProps} from "@radix-ui/react-icons/dist/types";
import {LucideIcon} from "lucide-react";

/**
 * 图标类型
 */
export type IconType = LucideIcon | React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;