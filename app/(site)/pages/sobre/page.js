'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import '../../styles/SobreNos.css'
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";



export default function SobreNos() {

  return (
    <div className="sobre-container">
      < div className="sobre-container-text">
        <div className="content-sobre-title">
          <h2 className="sobre-title">Quem Somos</h2>
          <div className="sobre-description">
            <p>Lorem ipsum dolor sit amet consectetur. In nunc ultricies at gravida sed sed. Quis consectetur fusce posuere mattis. Sed et augue curabitur tortor diam at maecenas pulvinar convallis. Sed quam augue velit cursus sociis. Sit duis pellentesque diam eget habitant integer sit. Tempus est fames aliquam pellentesque lectus pellentesque aliquam et. Facilisis eros quis blandit fames.</p>
            <p>Ut senectus tellus massa est proin etiam aenean blandit pellentesque. Eros commodo augue sed quam tristique egestas. Adipiscing placerat maecenas amet sociis tincidunt. Id consequat amet fringilla congue tempor vel non non quis. Quis at ut tincidunt nam consequat a iaculis arcu. Ut eget tincidunt diam aliquam egestas. Laoreet mi sagittis scelerisque amet in gravida ac mus justo. Tellus eu in ac imperdiet aenean. Egestas vestibulum leo vivamus malesuada diam diam. Fermentum facilisis laoreet quam viverra hendrerit interdum nulla. </p>
            <p> Ullamcorper tortor porta turpis vitae. Risus pellentesque purus amet pharetra diam vel. Tempor quis mauris placerat pellentesque. Dictum habitasse mus cursus feugiat quam quis id tincidunt massa. Purus gravida morbi purus mollis amet morbi mi. Malesuada penatibus interdum faucibus ultrices eget quis morbi venenatis. Blandit mauris proin nunc suspendisse tristique pharetra eget. Morbi sed facilisis dignissim condimentum at molestie eget lectus hendrerit.</p>
          </div>
        </div>
        <div className="content-sobre-title">
          <h2 className="sobre-title">Contato</h2>
          <div className="sobre-contato">
            <p>
              <FiPhone size={20} className="sobreIcon" /><Link href={'tel:+559999999999'} className='sobre-link'>(99) 99999-9999</Link></p>
            <p>
              <FiMail size={20} className="sobreIcon" /><Link href={'mailto:contato@maiseconomicoreceitas.com'} className='sobre-link'>contato@maiseconomicoreceitas.com</Link></p>
            <p>
              <FiMapPin size={20} className="sobreIcon" /><Link href={'https://www.google.com/maps/search/?api=1&query=Rua+das+Receitas,+123,+São+Paulo'} className='sobre-link'>Rua das Receitas, 123</Link></p>
          </div>
        </div>
      </div>
      <div className='sobre-second-img'>
        <Image
          src="/images/layout/we/we-are.png"
          alt="Sobre Nós do Site +Economico Receitas"
          width={526}
          height={526}
          className="sobre-img"
          priority
        />
      </div>
    </div >
  )

}