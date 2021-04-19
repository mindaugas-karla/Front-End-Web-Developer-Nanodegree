//import { ParticleNetwork } from './js/bgAnimation'
//import { extraMods } from './js/extraMods'
//import { base } from './js/base'

import { jsPDF } from "jspdf";

import { checkInput, reloadWeb, checkDate } from './js/helper'
import { checkStorage, createEntry, updateUser } from './js/storage'


import { app } from './js/app'

// Css
import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

export {
    checkInput,
    checkStorage,
    createEntry,
    updateUser,
    reloadWeb,
    jsPDF,
    checkDate
}