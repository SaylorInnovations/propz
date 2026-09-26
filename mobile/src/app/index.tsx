import * as Clipboard from 'expo-clipboard';
import { Storage } from 'expo-sqlite/kv-store';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { DEFAULT_JAR, JarConfig, jarUrl, validationError } from '../lib/propz';

const KEY = 'propz.jar.v1';
const colors: Record<string,string> = { cyan:'#18dff2', green:'#6fd08c', amber:'#e3b341', violet:'#a78bfa' };

export default function Home() {
  const [jar,setJar]=useState<JarConfig>(DEFAULT_JAR);
  const error=validationError(jar);
  const url=useMemo(()=>error?'':jarUrl(jar),[jar,error]);
  useEffect(()=>{ Storage.getItem(KEY).then(v=>v&&setJar({...DEFAULT_JAR,...JSON.parse(v)})).catch(()=>{}); },[]);
  const change=(k:keyof JarConfig,v:string)=>setJar(x=>({...x,[k]:v}));
  const save=async()=>{ if(error)return Alert.alert('Check your jar',error); await Storage.setItem(KEY,JSON.stringify(jar)); Alert.alert('Saved','Public jar details saved on this device.'); };
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
    <Text style={s.eyebrow}>GIVE CREDIT · SEND VALUE</Text><Text style={s.title}>Propz</Text>
    <Text style={s.lede}>Build and share a non-custodial crypto tip jar. Your wallet stays yours.</Text>
    <View style={s.card}>
      <Field label="Solana receiving address" value={jar.sol} set={v=>change('sol',v)} placeholder="Accept SOL and USDC" />
      <Text style={s.or}>OR / AND</Text>
      <Field label="Base receiving address" value={jar.base} set={v=>change('base',v)} placeholder="0x... — accept USDC" />
      <Field label="Display name" value={jar.name} set={v=>change('name',v)} placeholder="Your name or project" />
      <Field label="Message" value={jar.message} set={v=>change('message',v)} placeholder="What are supporters helping you make?" multiline />
      <Text style={s.label}>Accent</Text><View style={s.row}>{Object.keys(colors).map(a=><Pressable key={a} accessibilityRole="button" accessibilityLabel={`${a} accent`} accessibilityState={{selected:jar.accent===a}} onPress={()=>change('accent',a)} style={[s.swatch,{backgroundColor:colors[a]},jar.accent===a&&s.selected]} />)}</View>
      {!!error&&<Text style={s.error}>{error}</Text>}
      <Button label="Save jar" onPress={save} disabled={!!error}/>
    </View>
    {!!url&&<View style={[s.card,s.center]}>
      <Text style={s.heading}>{jar.name||'Your'} tip jar is ready</Text><View style={s.qr}><QRCode value={url} size={190}/></View>
      <Text style={s.help}>Supporters scan or open this link, then approve the payment in their own wallet. The displayed total includes Propz’s disclosed 1% platform fee.</Text>
      <Button label="Open payment page" onPress={()=>Linking.openURL(url)}/>
      <View style={s.actions}><Small label="Copy link" onPress={async()=>{await Clipboard.setStringAsync(url);Alert.alert('Copied','Jar link copied.')}}/><Small label="Share" onPress={()=>Share.share({message:url,url})}/></View>
    </View>}
    <Text style={s.disclosure}>Propz never requests private keys or seed phrases and never holds funds. Public wallet addresses and blockchain transactions are public. Confirm the recipient and network before approving.</Text>
    <Pressable onPress={()=>Linking.openURL('https://propz.saylorinnovations.com/extension-privacy')}><Text style={s.link}>Privacy policy</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

function Field({label,value,set,placeholder,multiline=false}:{label:string,value:string,set:(v:string)=>void,placeholder:string,multiline?:boolean}){return <><Text style={s.label}>{label}</Text><TextInput value={value} onChangeText={set} placeholder={placeholder} placeholderTextColor="#64748b" autoCapitalize="none" multiline={multiline} style={[s.input,multiline&&s.multi]}/></>}
function Button({label,onPress,disabled=false}:{label:string,onPress:()=>void,disabled?:boolean}){return <Pressable onPress={onPress} disabled={disabled} style={[s.primary,disabled&&s.disabled]}><Text style={s.primaryText}>{label}</Text></Pressable>}
function Small({label,onPress}:{label:string,onPress:()=>void}){return <Pressable onPress={onPress} style={s.secondary}><Text style={s.secondaryText}>{label}</Text></Pressable>}

const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#050d18'},page:{padding:22,paddingBottom:52,gap:16},eyebrow:{color:'#18dff2',fontSize:12,letterSpacing:2,fontWeight:'700'},title:{color:'#f4f1ea',fontSize:52,fontWeight:'900'},lede:{color:'#aab4c4',fontSize:17,lineHeight:25},card:{backgroundColor:'#0b1929',borderColor:'#20364f',borderWidth:1,borderRadius:18,padding:18,gap:10},label:{color:'#d8dee8',fontSize:13,fontWeight:'700',marginTop:5},input:{backgroundColor:'#071321',borderColor:'#29435f',borderWidth:1,borderRadius:10,color:'#f4f1ea',fontSize:15,paddingHorizontal:13,paddingVertical:12},multi:{minHeight:82,textAlignVertical:'top'},or:{color:'#64748b',fontSize:10,letterSpacing:2,textAlign:'center'},row:{flexDirection:'row',gap:13},swatch:{width:31,height:31,borderRadius:16,borderWidth:3,borderColor:'transparent'},selected:{borderColor:'#fff'},error:{color:'#f0b35f'},primary:{backgroundColor:'#18dff2',borderRadius:11,padding:15,alignItems:'center',marginTop:5},disabled:{opacity:.35},primaryText:{color:'#03141b',fontWeight:'900'},center:{alignItems:'center'},heading:{color:'#f4f1ea',fontSize:21,fontWeight:'800'},qr:{backgroundColor:'#fff',padding:14,borderRadius:14,marginVertical:8},help:{color:'#9aa8ba',lineHeight:20,textAlign:'center'},actions:{flexDirection:'row',gap:10,width:'100%'},secondary:{flex:1,borderColor:'#18dff2',borderWidth:1,borderRadius:11,padding:13,alignItems:'center'},secondaryText:{color:'#18dff2',fontWeight:'800'},disclosure:{color:'#73839a',fontSize:12,lineHeight:18,textAlign:'center'},link:{color:'#18dff2',textAlign:'center',textDecorationLine:'underline'}});
