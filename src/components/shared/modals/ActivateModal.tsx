import { useTranslation } from 'react-i18next'
import { X, Power } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CancelButton, SubmitButton } from '@/components/shared/buttons'

interface ActivateModalProps {
  open: boolean
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
  name: string
}

const ActivateModal: React.FC<ActivateModalProps> = ({
  open,
  onConfirm,
  onClose,
  loading,
  name,
}) => {
  const { t } = useTranslation('common')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Centered Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10">
              <Power className="h-6 w-6 text-green-600" />
            </div>
            
            {/* Title */}
            <DialogTitle className="text-xl">
              {t('modals.activate.title')}
            </DialogTitle>
            
            {/* Description */}
            <DialogDescription>
              {t('modals.activate.description', { name })}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Actions */}
        <DialogFooter className="flex-row gap-2 mt-6 w-full">
          <CancelButton
            onClick={onClose}
            disabled={loading}
            text={t('modals.cancel')}
            icon={<X className="h-4 w-4" />}
            className="flex-1"
          />
          <SubmitButton
            onClick={onConfirm}
            isLoading={loading}
            text={t('modals.activate.confirm')}
            loadingText={t('modals.processing')}
            icon={<Power className="h-4 w-4" />}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500 flex-1"
          />
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default ActivateModal
