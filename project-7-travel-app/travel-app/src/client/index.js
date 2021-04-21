//import { jsPDF } from "jspdf";
//can't make it work exatcly as I wish

import { checkInput, reloadWeb, checkDate } from './js/helper'
import { checkStorage, createEntry, updateUser } from './js/storage'

import { app } from './js/app'

// Css
import './styles/helper.scss'


import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/header.scss'

export {
    checkInput,
    checkStorage,
    createEntry,
    updateUser,
    reloadWeb,
    //jsPDF,
    checkDate
}