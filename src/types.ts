export type Node<T, Relations extends {}> = {
  value: T;
} & Relations;
