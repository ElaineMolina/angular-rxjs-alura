import { Component, OnDestroy } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Item, Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfor';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent implements OnDestroy{
  listaLivros: Livro [];
  campoBusca: string = '';
  // campoBusca = ""; //quando inicializa não precisa tipar
  subscripton: Subscription;
  livro: Livro;

  constructor(private service: LivroService) {}

  buscarLivros() {
    this,
      this.subscripton = this.service.buscar(this.campoBusca).subscribe({
        next: (items) =>{
          this.listaLivros = this.livrosResultadoParaLivros(items)
        },
        error: (erro) => console.log(erro),
      })
  }

  livrosResultadoParaLivros(items : Item[]) : LivroVolumeInfo[]{
    return items.map(item => {
      return new LivroVolumeInfo(item)
       });
  }

  ngOnDestroy() {
    this.subscripton.unsubscribe();
  }
}
