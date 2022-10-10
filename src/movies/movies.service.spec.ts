import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Testing GetAll', () => {
    it('return Array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    })
  })

  describe('Testing GetOne', () => {
    it("return film", () => {
      service.create({
        title: 'Test',
        genres: ['Test'],
        year: 2000
      })
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    })

    it('Return 404 error', () => {
      try {
        service.getOne(9999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Film s id: 9999 ne nayden!`)
      }
    })
  })

  describe('Testing remove', () => {
    it('Film delete', () => {
      service.create({
        title: 'Test',
        genres: ['Test'],
        year: 2000
      });
      const allMovies = service.getAll().length;
      service.remove(1);
      const afterRemove = service.getAll().length;
      expect(afterRemove).toBeLessThan(allMovies);
    })

    it('return error 404',()=>{
      try {
        service.remove(9999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  })

  describe('Testing Create',()=>{
    it('Create Film',()=>{
      const beforeCreate=service.getAll().length;
      service.create({
        title: 'Test',
        genres: ['Test'],
        year: 2000
      });
      const afterCreate=service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    })
  })

  describe('Testing patch',()=>{
    it('Film updated',()=>{
      service.create({
        title: 'Test',
        genres: ['Test'],
        year: 2000
      });
      service.patch(1,{title:'Updated test'})
      const movie=service.getOne(1)
      expect(movie.title).toEqual('Updated test')
    })

    it('return error 404',()=>{
      try {
        service.patch(9999,{title:''});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  })
});
