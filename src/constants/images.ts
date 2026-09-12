import logo from '@/assets/images/logo.png'
import login from '@/assets/images/login.png'
import futureX from '@/assets/images/futurex-logo.svg'
import approve from '@/assets/images/approve.svg'
import drivers from '@/assets/images/drivers.svg'
import sidebarBackground from '@/assets/images/sidebar/sidebar.png'
import avatarPlaceholder from '@/assets/images/avatar-placeholder.svg'
import dashboardHeros from '@/assets/images/heros/dashboard-hero.png'

//// icons
import box from '@/assets/icons/box-svgrepo-com.svg'
import nationalId from '@/assets/icons/id-card.svg'
import drivingLicense from '@/assets/icons/driver-license.svg'
import vehicleLicense from '@/assets/icons/vechile-license.svg'
import insuranceDocument from '@/assets/icons/insurance.svg'

const baseUrl = import.meta.env.BASE_URL

export const images = {
  logo,
  login,
  futureX,
  approve,
  drivers,
  avatarPlaceholder,
  redPowerLogo: `${baseUrl}images/red-power/brand/red-power-logo.png`,
  loginBackground: `${baseUrl}images/red-power/brand/og-share-background-og.jpg`,
  sidebarBackground,
  dashboardHeros,
}

export const icons = {
  box,
  nationalId,
  drivingLicense,
  vehicleLicense,
  insuranceDocument,
}