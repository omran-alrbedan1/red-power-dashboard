import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WorkItem, WorkStatus } from "../types/work-item.types"
import { useUpdateWorkItem } from "../hooks/useUpdateWorkItem"

interface WorkItemEditProps {
  workItem: WorkItem
  cardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const WorkItemEdit: React.FC<WorkItemEditProps> = ({
  workItem,
  cardId,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation("maintenance")
  const updateWorkItem = useUpdateWorkItem()

  const [progress, setProgress] = useState(workItem.progress || 0)
  const [status, setStatus] = useState<WorkStatus>(workItem.status)
  const [assignee, setAssignee] = useState(workItem.assignee || "")

  const handleSave = () => {
    updateWorkItem.mutate(
      {
        cardId,
        workItemId: workItem.id,
        updates: {
          progress,
          status,
          assignee: assignee || undefined,
        },
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  const handleCancel = () => {
    setProgress(workItem.progress || 0)
    setStatus(workItem.status)
    setAssignee(workItem.assignee || "")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("work.editWork")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("work.description")}</Label>
            <p className="text-sm text-muted-foreground">{workItem.description}</p>
          </div>

          <div className="space-y-2">
            <Label>{t("work.progress")}</Label>
            <div className="space-y-3">
              <Slider
                value={[progress]}
                onValueChange={(values) => setProgress(values[0])}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">{progress}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("work.status")}</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as WorkStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t("work.statuses.pending")}</SelectItem>
                <SelectItem value="in_progress">{t("work.statuses.in_progress")}</SelectItem>
                <SelectItem value="completed">{t("work.statuses.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("work.statuses.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("work.assignee")}</Label>
            <Input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder={t("work.assigneePlaceholder", "Assignee name")}
            />
          </div>
        </div>

        <DialogFooter>
          {updateWorkItem.isError && (
            <p className="me-auto text-sm text-destructive">{t("work.updateError")}</p>
          )}
          <Button variant="outline" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={updateWorkItem.isPending}>
            {updateWorkItem.isPending ? t("saving") : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
