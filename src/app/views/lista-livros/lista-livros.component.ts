import { catchError, debounce, debounceTime, distinctUntilChanged, EMPTY, filter, map, of, Subscription, switchMap, tap, throwError } from 'rxjs';
import { Item, Livro, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfor';
import { LivroService } from 'src/app/service/livro.service';

import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { listAnimationTrigger } from 'src/app/aninmations';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [listAnimationTrigger]
})
export class ListaLivrosComponent{
  campoBusca = new FormControl();
  // campoBusca = ""; //quando inicializa não precisa tipar
  mensagemErro = '';
  livrosResultado : LivrosResultado;

  constructor(private service: LivroService) {}

  totalDeLivros$ = this.campoBusca.valueChanges
  .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      catchError(erro => {
          console.log(erro)
          return of()
      })
  )

  livrosEncontrados$ = this.campoBusca.valueChanges
  .pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    tap((retornoAPI) => console.log(retornoAPI)),
    map(resultado => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      // this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'
      // return EMPTY
      console.log(erro)
      return throwError(() => new Error(this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'))
    })
  )

  livrosResultadoParaLivros(items : Item[]) : LivroVolumeInfo[]{
    return items.map(item => {
      return new LivroVolumeInfo(item)
       });
  }

}
