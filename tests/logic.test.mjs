import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_RATE, currentRate, localCalendarDay, shouldReplace, sanitizedSettings, stableBucket } from '../logic.mjs';

test('primeiro dia inicia exatamente em 1%', () => assert.equal(currentRate(20, 20), 1));
test('um ponto percentual por dia', () => { assert.equal(currentRate(20,21),2); assert.equal(currentRate(20,49),30); });
test('limite máximo em 100%', () => { assert.equal(currentRate(0,99),100); assert.equal(currentRate(0,999),100); });
test('relógio retrocedendo não reduz de 1%', () => assert.equal(currentRate(20,19),1));
test('datas inválidas não quebram a página', () => { assert.equal(currentRate(null,20),BASE_RATE); assert.throws(() => localCalendarDay(new Date(NaN)), TypeError); });
test('calendário local, não número de blocos de 24 horas', () => assert.equal(localCalendarDay(new Date(2026,9,16,23,59)),localCalendarDay(new Date(2026,9,16,0,1))));
test('probabilidade 0 e 100%', () => { assert.equal(shouldReplace('a','minhasemente',0),false); assert.equal(shouldReplace('a','minhasemente',100),true); });
test('decisão consistente e crescente por imagem', () => { const id='javascript',seed='minhasemente'; assert.equal(shouldReplace(id,seed,23),shouldReplace(id,seed,23)); for(let p=0;p<100;p++) if(shouldReplace(id,seed,p)) assert.equal(shouldReplace(id,seed,p+1),true); });
test('hash sempre entre 0 e 99', () => { for(let i=0;i<200;i++) assert.ok(stableBucket(String(i)) >= 0 && stableBucket(String(i)) < 100); });
test('rejeita preferências inválidas ou não autorizadas', () => { assert.equal(sanitizedSettings({accepted:false,startDay:1,seed:'123456'}),null);assert.equal(sanitizedSettings({accepted:true,startDay:'1',seed:'123456'}),null);assert.equal(sanitizedSettings(null),null); });
test('carrega preferências válidas', () => assert.deepEqual(sanitizedSettings({accepted:true,startDay:123,seed:'abcdefghi'}),{accepted:true,startDay:123,seed:'abcdefghi'}));
