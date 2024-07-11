import React from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import {CircleHelp} from "lucide-react";

export interface FormHoverDescriptionProps {

  children?: React.ReactNode;

}

/**
 * 表单字段悬浮说明
 * @constructor
 */
export default function FormHoverDescription({children}: FormHoverDescriptionProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <CircleHelp className={"h-4 w-4"}/>
      </HoverCardTrigger>
      <HoverCardContent>
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}