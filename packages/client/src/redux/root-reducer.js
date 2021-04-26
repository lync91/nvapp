import { combineReducers } from 'redux';
import App from '@iso/redux/app/reducer';
import Auth from '@iso/redux/auth/reducer';
import ThemeSwitcher from '@iso/redux/themeSwitcher/reducer';
import Ecommerce from '@iso/redux/ecommerce/reducer';
import LanguageSwitcher from '@iso/redux/languageSwitcher/reducer';
import scrumBoard from '@iso/redux/scrumBoard/reducer';
import modal from '@iso/redux/modal/reducer';
import drawer from '@iso/redux/drawer/reducer';

export default combineReducers({
  Auth,
  App,
  ThemeSwitcher,
  Ecommerce,
  LanguageSwitcher,
  scrumBoard,
  modal,
  drawer
});
