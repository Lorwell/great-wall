import React from "react";
import {CircleHelp} from "lucide-react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.tsx";

export interface FormHoverDescriptionProps {

  title: React.ReactNode

  children?: React.ReactNode;

}

/**
 * 表单字段sheet说明
 * @constructor
 */
export default function FormSheetDescription({title, children}: FormHoverDescriptionProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <CircleHelp className={"h-4 w-4"}/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription asChild>
            {children}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}