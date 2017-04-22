import resolver from './helpers/resolver'
import {mocha} from 'mocha'
import {setResolver} from 'ember-mocha'
import Reporter from './helpers/ember-cli-mocha-reporter'

setResolver(resolver)


console.log('mocha', mocha)
mocha.reporter(Reporter)
